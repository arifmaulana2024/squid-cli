import { Box, render, Text, useInput } from 'ink';
import { UncontrolledTextInput } from 'ink-text-input';
import React, { useEffect, useState } from 'react';

import { profile } from '../api/profile';
import { CliCommand } from '../command';
import { getConfig } from '../config';

const enterAltScreenCommand = '\x1b[?1049h';
const leaveAltScreenCommand = '\x1b[?1049l';
const spacing = (n: number) => n;

const FullScreen: React.FC<React.PropsWithChildren> = (props) => {
  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    }

    onResize();
    process.stdout.on('resize', onResize);
    process.stdout.write(enterAltScreenCommand);
    process.on('exit', () => {
      process.stdout.write(leaveAltScreenCommand);
    });
    return () => {
      process.stdout.off('resize', onResize);
      process.stdout.write(leaveAltScreenCommand);
    };
  }, []);

  return (
    <Box width={size.columns} height={size.rows} flexDirection="column" padding={spacing(0.2)}>
      {props.children}
    </Box>
  );
};

const WhoAmI: React.FC<React.PropsWithChildren> = (props) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    profile().then(({ username }) => {
      setUser(username);
    });
  }, []);
  const { apiUrl } = getConfig();

  return (
    <Box flexDirection="column" margin={spacing(0.2)}>
      <Box>
        <Box justifyContent="flex-start" marginRight={spacing(1)}>
          <Text color="orange">API URL</Text>
        </Box>
        <Box>
          <Text bold color="white">
            {apiUrl}
          </Text>
        </Box>
      </Box>
      <Box>
        <Box justifyContent="flex-start" marginRight={spacing(1)}>
          <Text color="orange">User</Text>
        </Box>
        <Box>
          <Text bold color="white">
            {user ? user : 'Anon'}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const Search = () => {
  return (
    <Box borderStyle="single">
      <UncontrolledTextInput onSubmit={() => {}} />
    </Box>
  );
};

const Layout = () => {
  return (
    <FullScreen>
      <Box padding={spacing(1)} height={5}>
        <WhoAmI />
      </Box>
      <Search />
      <Box borderStyle="single" borderColor="cyan" padding={spacing(1)} flexGrow={1}>
        <Text>Will be 3/4</Text>
      </Box>
    </FullScreen>
  );
};

export default class Index extends CliCommand {
  static description = ``;

  async run(): Promise<void> {
    render(<Layout />);
  }
}
