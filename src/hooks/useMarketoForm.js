import { useEffect } from 'react';
import { navigate } from 'gatsby';

const useMarketoForm = (munchkinId, id, publishableKey, redirectLink) => {
  useEffect(() => {
    window.MktoForms2.loadForm(
      '//app-abj.marketo.com',
      munchkinId,
      id,
      (form) => {
        // eslint-disable-next-line no-unused-vars
        form.onSuccess(function (values, followUpUrl) {
          navigate(redirectLink);
        });
      }
    );

    const pollForDefinition = (scope, varname, callback) => {
      if (typeof scope[varname] !== 'undefined') {
        return callback();
      }
      const interval = setInterval(() => {
        if (typeof scope[varname] !== 'undefined') {
          clearInterval(interval);
          callback();
        }
      }, 250);
    };
    const script = document.createElement('script');
    script.src = 'https://marketo.clearbit.com/assets/v1/marketo/forms.js';
    script.async = true;
    script.setAttribute('data-clearbit-publishable-key', publishableKey);
    script.onerror = () => {
      // eslint-disable-next-line no-console
      console.log('Clearbit Form JS unable to load');
      pollForDefinition(window, 'MktoForms2', () => {
        window.MktoForms2.whenReady((form) => {
          form.setValues({
            clearbitFormStatus: 'Clearbit Form JS unable to load',
          });
        });
      });
    };
    document.body.append(script);
  }, [munchkinId, id, publishableKey, redirectLink]);
};

export default useMarketoForm;
