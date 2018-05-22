import React from "react";

import { Flex, Truncate } from "rebass";
import Icon from "metabase/components/Icon";

import { normal } from "metabase/lib/colors";

const EntityItemWrapper = Flex.extend`
  border-bottom: 1px solid #f8f9fa;
  /* TODO - figure out how to use the prop instead of this? */
  align-items: center;
  &:hover {
    color: ${normal.blue};
  }
`;

const IconWrapper = Flex.extend`
  background: #f4f5f6;
  border-radius: 6px;
`;

const EntityItem = ({ name, iconName, iconColor }) => {
  return (
    <EntityItemWrapper py={2} px={2}>
      <IconWrapper p={1} mr={1} align="center" justify="center">
        <Icon name={iconName} color={iconColor} />
      </IconWrapper>
      <h3>
        <Truncate>{name}</Truncate>
      </h3>
    </EntityItemWrapper>
  );
};

export default EntityItem;
