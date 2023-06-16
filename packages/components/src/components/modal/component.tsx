/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Component, h, Host, JSX, Prop, State, Watch } from '@stencil/core';

import { Generic } from '@a11y-ui/core';
import { AriaLabel } from '../../types/aria-label';
import { KoliBriModalEventCallbacks } from '../../types/modal';
import { featureHint } from '../../utils/a11y.tipps';
import { getKoliBri } from '../../utils/dev.utils';
import { setState, watchString, watchValidator } from '../../utils/prop.validators';
import { ModalService } from './service';
import { validateLabel } from '../../types/props';

/**
 * https://en.wikipedia.org/wiki/Modal_window
 */

type RequiredProps = unknown;
type OptionalProps = {
	activeElement: HTMLElement | null;
	label: string;
	on: KoliBriModalEventCallbacks;
	width: string;
} & AriaLabel;
// type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = {
	activeElement: HTMLElement | null;
	label: string;
	width: string;
};
type OptionalStates = {
	on: KoliBriModalEventCallbacks;
} & AriaLabel;
type States = Generic.Element.Members<RequiredStates, OptionalStates>;

/**
 * @slot - Der Inhalt des Modals.
 */
@Component({
	tag: 'kol-modal',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolModal implements Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates> {
	private hostElement?: HTMLElement;

	public componentDidRender(): void {
		if (this.hostElement /* SSR instanceof HTMLElement */) {
			if (this.state._activeElement /* SSR instanceof HTMLElement */) {
				(getKoliBri().Modal as ModalService).openModal(this.hostElement, this.state._activeElement);
			} else {
				(getKoliBri().Modal as ModalService).closeModal(this.hostElement);
			}
		}
	}

	public disconnectedCallback(): void {
		if (this.hostElement /* SSR instanceof HTMLElement */) {
			(getKoliBri().Modal as ModalService).closeModal(this.hostElement);
		}
	}

	private readonly onKeyDown = (event: KeyboardEvent) => {
		if (event && event.code === 'Escape') {
			this._activeElement = null;
		}
	};

	public render(): JSX.Element {
		return (
			<Host
				ref={(el) => {
					this.hostElement = el as HTMLElement;
				}}
			>
				{this.state._activeElement /* SSR instanceof HTMLElement */ && (
					<div class="overlay">
						<div
							class="modal"
							style={{
								width: this.state._width,
							}}
							aria-label={this.state._label}
							aria-modal="true"
							role="dialog"
							onKeyDown={this.onKeyDown}
							ref={(el) => {
								if (el /* SSR instanceof HTMLElement */) {
									el.setAttribute('tabindex', '0');
									setTimeout(() => el.focus(), 250);
								}
							}}
						>
							<slot />
						</div>
					</div>
				)}
			</Host>
		);
	}

	/**
	 * Gibt die Referenz auf das auslösende HTML-Element an, wodurch das Modal geöffnet wurde.
	 */
	@Prop({ mutable: true }) public _activeElement?: HTMLElement | null;

	/**
	 * Setzt die sichtbare oder semantische Beschriftung der Komponente (z.B. Aria-Label, Label, Headline, Caption, Summary usw.).
	 * @deprecated use _label instead
	 */
	@Prop() public _ariaLabel!: string;

	/**
	 * Setzt die sichtbare oder semantische Beschriftung der Komponente (z.B. Aria-Label, Label, Headline, Caption, Summary usw.).
	 */
	@Prop() public _label?: string;

	/**
	 * Gibt die EventCallback-Function für das Schließen des Modals an.
	 */
	@Prop() public _on?: KoliBriModalEventCallbacks;

	/**
	 * Setzt die Breite des Modals. (max-width: 100%).
	 */
	@Prop() public _width?: string = '100%';

	@State() public state: States = {
		_activeElement: null,
		_label: '…',
		_width: '100%',
	};

	@Watch('_activeElement')
	public validateActiveElement(value?: HTMLElement | null): void {
		watchValidator(this, '_activeElement', (value): boolean => typeof value === 'object' || value === null, new Set(['HTMLElement', 'null']), value, {
			defaultValue: null,
		});
	}

	/**
	 * @deprecated use _label instead
	 */
	@Watch('_ariaLabel')
	public validateAriaLabel(value?: string): void {
		if (!this.state._label) {
			validateLabel(this, value);
		}
	}

	@Watch('_label')
	public validateLabel(value?: string): void {
		validateLabel(this, value);
	}

	@Watch('_on')
	public validateOn(value?: KoliBriModalEventCallbacks): void {
		if (typeof value === 'object' && value !== null) {
			featureHint('[KolTabs] Prüfen, wie man auch einen EventCallback einzeln ändern kann.');
			const callbacks: KoliBriModalEventCallbacks = {};
			if (typeof value.onClose === 'function' || value.onClose === true) {
				callbacks.onClose = value.onClose;
			}
			setState<KoliBriModalEventCallbacks>(this, '_on', callbacks);
		}
	}

	@Watch('_width')
	public validateWidth(value?: string): void {
		watchString(this, '_width', value, {
			defaultValue: '100%',
		});
	}

	public componentWillLoad(): void {
		this.validateActiveElement(this._activeElement);
		this.validateAriaLabel(this._ariaLabel);
		this.validateLabel(this._label);
		this.validateOn(this._on);
		this.validateWidth(this._width);
	}
}
