/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Command } from 'vs/editor/common/modes';
import { ColorIdentifier } from 'vs/platform/theme/common/colorRegistry';
import { ISequence } from 'vs/base/common/sequence';

export interface IBaselineResourceProvider {
	getBaselineResource(resource: URI): TPromise<URI>;
}

export const ISCMService = createDecorator<ISCMService>('scm');

export interface ISCMResourceDecorations {
	icon?: URI;
	iconDark?: URI;
	tooltip?: string;
	strikeThrough?: boolean;
	faded?: boolean;

	source?: string;
	letter?: string;
	color?: ColorIdentifier;
}

export interface ISCMResource {
	readonly resourceGroup: ISCMResourceGroup;
	readonly sourceUri: URI;
	readonly decorations: ISCMResourceDecorations;
	open(): TPromise<void>;
}

export interface ISCMResourceGroup extends ISequence<ISCMResource> {
	readonly provider: ISCMProvider;
	readonly label: string;
	readonly id: string;
	readonly hideWhenEmpty: boolean;
	readonly onDidChange: Event<void>;
}

export interface ISCMProvider extends IDisposable {
	readonly label: string;
	readonly id: string;
	readonly contextValue: string;

	readonly groups: ISequence<ISCMResourceGroup>;

	// TODO@Joao: remove
	readonly onDidChangeResources: Event<void>;

	readonly rootUri?: URI;
	readonly count?: number;
	readonly commitTemplate?: string;
	readonly onDidChangeCommitTemplate?: Event<string>;
	readonly acceptInputCommand?: Command;
	readonly statusBarCommands?: Command[];
	readonly onDidChange: Event<void>;

	getOriginalResource(uri: URI): TPromise<URI>;
}

export interface ISCMInput {
	value: string;
	readonly onDidChange: Event<string>;

	placeholder: string;
	readonly onDidChangePlaceholder: Event<string>;
}

export interface ISCMRepository extends IDisposable {
	readonly onDidFocus: Event<void>;
	readonly provider: ISCMProvider;
	readonly input: ISCMInput;
	focus(): void;
}

export interface ISCMService {

	readonly _serviceBrand: any;
	readonly onDidAddRepository: Event<ISCMRepository>;
	readonly onDidRemoveRepository: Event<ISCMRepository>;

	readonly repositories: ISCMRepository[];

	registerSCMProvider(provider: ISCMProvider): ISCMRepository;
}
