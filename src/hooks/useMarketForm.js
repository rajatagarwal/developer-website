import { useEffect } from 'react';

const useMarketoForm = (munchkinId, id, publishableKey) =>
  useEffect(() => {
    window.MktoForms2.loadForm('//app-abj.marketo.com', munchkinId, id);

    const pollForDefinition = function (scope, varname, callback) {
      if (typeof scope[varname] !== 'undefined') {
        return callback();
      }
      const interval = setInterval(function () {
        if (typeof scope[varname] !== 'undefined') {
          clearInterval(interval);
          callback();
        }
      }, 250);
    };
    const script = document.createElement('script');
    script.src = 'https://marketo.clearbit.com/assets/v1/marketo/forms.js';
    script.async = true;
    script.setAttribute('data-clearbit-publishable-key', pubishableKey);
    script.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('Clearbit Form JS unable to load');
      pollForDefinition(window, 'MktoForms2', function () {
        window.MktoForms2.whenReady(function (form) {
          form.setValues({
            clearbitFormStatus: 'Clearbit Form JS unable to load',
          });
        });
      });
    };
    document.body.append(script);
  }, [munchkinId, id]);

export default useMarketoForm;