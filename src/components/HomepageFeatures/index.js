import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Agent Centric',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Agents represent humans with their devices, which is what the internet actually is.
        Technically represented as Decentralized Identifier - DID.
      </>
    ),
  },
  {
    title: 'Rich Languages',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Languages encapsulate the actual technology used to communicate, like Holochain or IPFS,
        but what they provide to the high-level layers is this: Languages define Expressions,
        which are the atoms of what Agents communicate. Expressions are always created, and thus signed, by an agent.
      </>
    ),
  },
  {
    title: 'Authenticated Perspectives',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Perspectives belong to a specific agent. They represent context and association between expressions.
        They consist of a list of RDF/semantic web like triplets (subject-predicate-obejct) called links because all three items are just URLs pointing to expressions.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
