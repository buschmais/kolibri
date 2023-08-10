/* types */
import { Generic } from '@a11y-ui/core';
import { watchBoolean } from '../../utils/prop.validators';

export type HasChildrenPropType = boolean;

/**
 * Defines whether the component has slotted children.
 **/
export type PropHasChildren = {
	hasChildren: HasChildrenPropType;
};

/* validator */
export const validateHasChildren = (component: Generic.Element.Component, value?: HasChildrenPropType): void => {
	watchBoolean(component, '_hasChildren', value);
};