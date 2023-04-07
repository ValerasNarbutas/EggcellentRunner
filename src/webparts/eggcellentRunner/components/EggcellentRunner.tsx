import * as React from 'react';
import styles from './EggcellentRunner.module.scss';
import { IEggcellentRunnerProps } from './IEggcellentRunnerProps';
import RunnerGame from './RunnerGame';
import { Stack, Text } from '@fluentui/react';


const EggcellentRunnerWebPart: React.FunctionComponent = () => {
  return (
    <div>
      <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%' } }}>
        <Text variant="xLarge" styles={{ root: { marginBottom: '1rem' } }}>
          Happy Easter
        </Text>
      </Stack>
      <RunnerGame />
    </div>
  );
};

export default class EggcellentRunner extends React.Component<IEggcellentRunnerProps, {}> {
  public render(): React.ReactElement<IEggcellentRunnerProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.eggcellentRunner} ${hasTeamsContext ? styles.teams : ''}`}>
        <EggcellentRunnerWebPart />
      </section>
    );
  }
}


