// 
// Type definitions for mathquill.
// Reference: https://github.com/mathquill/mathquill/blob/1cbc1c4128ec87db3733bc99965522f7d62cde75/src/mathquill.d.ts
// 

// The global MathQuill object 
export interface MathQuill {
  getInterface(version: 1): v1.API;
  getInterface(version: 2): v1.API;
  getInterface(version: 3): v3.API;
}

export type Direction = -1 | 1;

export namespace v3 {
  export type HandlersWithDirection = v1.HandlersWithDirection;
  export type HandlersWithoutDirection = v1.HandlersWithoutDirection;
  export type HandlerOptions = v1.HandlerOptions<BaseMathQuill>;
  export type EmbedOptions = v1.EmbedOptions;
  export type EmbedOptionsData = v1.EmbedOptionsData;

  export type Config = Omit<v1.Config, 'substituteKeyboardEvents' | 'handlers'> & {
    handlers?: HandlerOptions;
  };

  export interface BaseMathQuill {
    id: number;
    data: { [key: string]: any };
    revert: () => HTMLElement;
    latex(latex: string): BaseMathQuill;
    latex(): string;
    reflow: () => void;
    el: () => HTMLElement;
    getAriaLabel(): string;
    setAriaLabel(str: string): BaseMathQuill;
    html: () => string;
    mathspeak: () => string;
    text(): string;
  }

  export interface EditableMathQuill {
    id: number;
    data: { [key: string]: any };
    revert: () => HTMLElement;
    latex(latex: string): EditableMathQuill;
    latex(): string;
    reflow: () => void;
    el: () => HTMLElement;
    getAriaLabel(): string;
    setAriaLabel(str: string): EditableMathQuill;
    html: () => string;
    mathspeak: () => string;
    text(): string;

    select: () => EditableMathQuill;
    moveToRightEnd: () => EditableMathQuill;
    moveToLeftEnd: () => EditableMathQuill;
    cmd: (latex: string) => EditableMathQuill;
    write: (latex: string) => EditableMathQuill;
    keystroke: (key: string, evt?: KeyboardEvent) => EditableMathQuill;
    typedText: (text: string) => EditableMathQuill;
    clearSelection: () => EditableMathQuill;
    blur: () => EditableMathQuill;
    focus: () => EditableMathQuill;
    getAriaPostLabel: () => string;
    setAriaPostLabel: (str: string, timeout?: number) => EditableMathQuill;
    ignoreNextMousedown: (func: () => boolean) => EditableMathQuill;
    clickAt: (x: number, y: number, el: HTMLElement) => EditableMathQuill;
  }

  export interface API {
    (el: HTMLElement): BaseMathQuill | null;

    StaticMath(el: null | undefined): null;
    StaticMath(el: HTMLElement, config?: Config): BaseMathQuill;

    MathField(el: null | undefined): null;
    MathField(el: HTMLElement, config?: Config): EditableMathQuill;

    InnerMathField(el: null | undefined): null;
    InnerMathField(el: HTMLElement, config?: Config): EditableMathQuill;

    TextField?: {
      (el: null | undefined): null;
      (el: HTMLElement, config?: Config): EditableMathQuill;
    };

    L: -1;
    R: 1;
    config(options: Config): void;
    registerEmbed(
      name: string,
      options: (data: v1.EmbedOptionsData) => v1.EmbedOptions
    ): void;
  }
}

export namespace v1 {
  export interface Config<$ = DefaultJquery> {
    ignoreNextMousedown?: (_el: MouseEvent) => boolean;
    substituteTextarea?: () => HTMLElement;
    substituteKeyboardEvents?: (
      textarea: $,
      controller: unknown
    ) => {
      select: (text: string) => void;
    };

    restrictMismatchedBrackets?: boolean;
    typingSlashCreatesNewFraction?: boolean;
    charsThatBreakOutOfSupSub?: string;
    sumStartsWithNEquals?: boolean;
    autoSubscriptNumerals?: boolean;
    supSubsRequireOperand?: boolean;
    spaceBehavesLikeTab?: boolean;
    typingAsteriskWritesTimesSymbol?: boolean;
    typingSlashWritesDivisionSymbol?: boolean;
    typingPercentWritesPercentOf?: boolean;
    resetCursorOnBlur?: boolean | undefined;
    leftRightIntoCmdGoes?: 'up' | 'down';
    enableDigitGrouping?: boolean;
    mouseEvents?: boolean;
    maxDepth?: number;
    disableCopyPaste?: boolean;
    statelessClipboard?: boolean;
    onPaste?: () => void;
    onCut?: () => void;
    overrideTypedText?: (text: string) => void;
    overrideKeystroke?: (key: string, event: KeyboardEvent) => void;
    autoOperatorNames?: string;
    autoCommands?: string;
    autoParenthesizedFunctions?: string;
    quietEmptyDelimiters?: string;
    disableAutoSubstitutionInSubscripts?: boolean;
    handlers?: HandlerOptions<BaseMathQuill<$>>;
  }

  export interface Handler<MQClass> {
    (mq: MQClass): void;
    (dir: Direction, mq: MQClass): void;
  }

  export type HandlersWithDirection = 'moveOutOf' | 'deleteOutOf' | 'selectOutOf';
  export type HandlersWithoutDirection =
    | 'reflow'
    | 'enter'
    | 'upOutOf'
    | 'downOutOf'
    | 'edited'
    | 'edit';
  export type HandlerOptions<MQClass = unknown> = Partial<
    {
      [K in HandlersWithDirection]: (dir: Direction, mq: MQClass) => void;
    } & {
      [K in HandlersWithoutDirection]: (mq: MQClass) => void;
    }
  >;
  export type HandlerName = keyof HandlerOptions;

  export interface BaseMathQuill<$ = DefaultJquery> {
    id: number;
    data: { [key: string]: any };
    revert: () => $;
    latex(latex: string): void;
    latex(): string;
    reflow: () => void;
    el: () => HTMLElement;
    getAriaLabel: () => string;
    setAriaLabel: (str: string) => void;
    html: () => string;
    mathspeak: () => string;
    text(): string;
  }

  export interface EditableMathQuill extends BaseMathQuill {
    select: () => void;
    moveToRightEnd: () => void;
    cmd: (latex: string) => void;
    write: (latex: string) => void;
    keystroke: (key: string, evt?: KeyboardEvent) => void;
    typedText: (text: string) => void;
    clearSelection: () => void;
    blur: () => void;
    focus: () => void;
    getAriaPostLabel: () => string;
    setAriaPostLabel: (str: string, timeout?: number) => void;
    ignoreNextMousedown: (func: () => boolean) => void;
    clickAt: (x: number, y: number, el: HTMLElement) => void;
  }

  export interface EmbedOptions {
    latex?: () => string;
    text?: () => string;
    htmlString?: string;
  }
  export type EmbedOptionsData = any;

  export interface API {
    (el: HTMLElement): BaseMathQuill | null;

    StaticMath(el: null | undefined): null;
    StaticMath(el: HTMLElement, config?: Config): BaseMathQuill;

    MathField(el: null | undefined): null;
    MathField(el: HTMLElement, config?: Config): EditableMathQuill;

    InnerMathField(el: null | undefined): null;
    InnerMathField(el: HTMLElement, config?: Config): EditableMathQuill;

    TextField?: {
      (el: null | undefined): null;
      (el: HTMLElement, config?: Config): EditableMathQuill;
    };

    L: -1;
    R: 1;
    config(options: Config): void;
    registerEmbed(
      name: string,
      options: (data: EmbedOptionsData) => EmbedOptions
    ): void;
  }
}

interface DefaultJquery {
  (el: HTMLElement): DefaultJquery;
  length: number;
  [index: number]: HTMLElement | undefined;
}