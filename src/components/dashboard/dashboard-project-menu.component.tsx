import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useLaunchDarklyConfig } from 'hooks/use-launchdarkly-config';

export const DashboardProjectMenu = () => {
  const { projectKey, setProjectKey, projects } = useLaunchDarklyConfig();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} marginRight="2">
        Project: {projectKey}
      </MenuButton>
      <MenuList>
        {projects.map((project) => {
          return (
            <MenuItem minH="48px" key={project.key} onClick={() => setProjectKey(project.key)}>
              <span>
                {project.key} ({project.name})
              </span>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
