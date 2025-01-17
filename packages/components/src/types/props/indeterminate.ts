import { Generic } from '@a11y-ui/core';

import { watchBoolean } from '../../utils/prop.validators';

/* types */
export type IndeterminatePropType = boolean;

/**
 * Puts the checkbox in the indeterminate state, does not change the value of _checked.
 */
export type PropIndeterminate = {
	indeterminate: IndeterminatePropType;
};

/* validator */
export const validateIndeterminate = (component: Generic.Element.Component, value?: IndeterminatePropType): void => {
	watchBoolean(component, '_indeterminate', value);
};
