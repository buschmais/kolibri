import { Generic } from '@a11y-ui/core';

type RequiredProps = {
	version: string;
};
type OptionalProps = unknown;
export type KoliBriVersionProps = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = RequiredProps;
type OptionalStates = OptionalProps;

export type KoliBriVersionStates = Generic.Element.Members<RequiredStates, OptionalStates>;
export type KoliBriVersionAPI = Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates>;
