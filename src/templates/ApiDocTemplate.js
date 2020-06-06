import React, { Fragment, useState } from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import InlineCodeSnippet from '../components/InlineCodeSnippet';
import ReactMarkdown from 'react-markdown';
import Container from '../components/Container';
import ComponentExample from '../components/ComponentExample';
import FunctionDefinition from '../components/FunctionDefinition';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import SEO from '../components/Seo';
import PropList from '../components/PropList';
import pages from '../data/sidenav.json';
import styles from './ApiDocTemplate.module.scss';
import useComponentDoc from '../hooks/useComponentDoc';

const previewStyles = {
  Spinner: {
    height: '16px',
  },
};

const ApiDocTemplate = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mdx } = data;
  const { frontmatter } = mdx;
  const { title, description, component } = frontmatter;
  const componentDoc = useComponentDoc(component);

  const { description: componentDescription, methods = [], usage = '' } =
    componentDoc ?? {};

  return (
    <Layout>
      <SEO title={title} description={description} />
      <Container className={styles.container}>
        <Sidebar
          className={styles.sidebar}
          pages={pages}
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
        />
        <main className={styles.content}>
          <h1>{component}</h1>

          <section className={cx(styles.section, styles.description)}>
            <ReactMarkdown source={componentDescription} />
          </section>

          <section className={styles.section}>
            <h2>Usage</h2>
            <InlineCodeSnippet language="js">{usage}</InlineCodeSnippet>
          </section>

          {methods.length > 0 && (
            <section className={styles.section}>
              <h2>API methods</h2>
              {methods.map((method, i) => (
                <Fragment key={i}>
                  <h3 className={styles.methodName}>{method.name}</h3>
                  <ReactMarkdown
                    className={styles.methodDescription}
                    source={method.description}
                  />
                  <FunctionDefinition
                    params={method.params}
                    returnValue={method.returnValue}
                  />
                  {method.examples.map((example, i) => (
                    <ComponentExample
                      key={i}
                      className={styles.componentExample}
                      example={example}
                    />
                  ))}
                </Fragment>
              ))}
            </section>
          )}
        </main>
      </Container>
    </Layout>
  );
};

ApiDocTemplate.propTypes = {
  data: PropTypes.object,
};

export const pageQuery = graphql`
  query($path: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      body
      frontmatter {
        path
        title
        description
        component
      }
    }
  }
`;

export default ApiDocTemplate;
