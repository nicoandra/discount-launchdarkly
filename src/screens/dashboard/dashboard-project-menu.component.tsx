import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';
import { LaunchDarklyProject } from 'utils/launchdarkly-api';

export const DashboardProjectMenu = () => {
  const { projectKey, setProjectKey } = useLaunchDarklyConfig();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} marginRight="2">
        Project: {projectKey}
      </MenuButton>
      <MenuList>
        <MenuItem minH="48px" onClick={() => setProjectKey(LaunchDarklyProject.DEFAULT)}>
          <span>default</span>
        </MenuItem>
        <MenuItem minH="40px" onClick={() => setProjectKey(LaunchDarklyProject.ORDERUP)}>
          <span>orderup</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
