import { 
  type ForwardedRef, 
  type HTMLAttributes, 
  type Ref, 
  type RefObject, 
  forwardRef, 
  useCallback, 
  useEffect, 
  useMemo, 
  useRef 
} from "react";

import { v1 } from "./types";

// Import JQuery, required for the functioning of the equation editor
import $ from "jquery";

// Import the styles from the Mathquill editor
import "mathquill/build/mathquill.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.jQuery = $;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
require("mathquill/build/mathquill");

const mathQuill = MathQuill.getInterface(2);

export type EquationEditorMathField = v1.EditableMathQuill;
export type EquationEditorConfig = v1.Config;

export type EquationEditorConfigProperty = Omit<EquationEditorConfig, 'handlers'>;
export type EquationEditorHandlersProperty = EquationEditorConfig['handlers'];

// Props from previous implementation to prevent breaking users code after an update
export type EquationEditorBackwardsCompProps = Pick<EquationEditorConfig, 'spaceBehavesLikeTab' | 'autoCommands' | 'autoOperatorNames'> & {
  onEnter?: () => void;
};

export type EquationEditorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;

  config?: EquationEditorConfigProperty;
  handlers?: EquationEditorHandlersProperty;

  mathFieldActionRef?: Ref<EquationEditorMathField>;
} & EquationEditorBackwardsCompProps;

const EquationEditorBase = (
  {
    value,
    onChange,

    config,
    handlers,
    
    mathFieldActionRef,

    spaceBehavesLikeTab,
    autoCommands,
    autoOperatorNames,
    onEnter,

    ...props
  }: EquationEditorProps,
  forwardedRef: ForwardedRef<HTMLSpanElement>
) => {
  const mathFieldRef = useRef<EquationEditorMathField | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const ignoreEditEventsRef = useRef(2);

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
    
    if (!mathFieldRef.current) {
      return;
    }

    if (mathFieldRef.current.latex() !== value) {
      mathFieldRef.current.latex(value ?? '');
    }
  }, [value]);

  const createConfig = useCallbackRef((): EquationEditorConfig => {
    return {
      spaceBehavesLikeTab,
      autoCommands,
      autoOperatorNames,
      ...config,
      handlers: {
        enter: onEnter,
        ...handlers,
        edit: (mq) => {
          const currentIgnoreEditEvents = ignoreEditEventsRef.current;
          if (currentIgnoreEditEvents > 0) {
            ignoreEditEventsRef.current -= 1;
            return;
          }

          const mathField = mathFieldRef.current;
          if (!mathField) {
            return;
          }

          const currentValue = valueRef.current;
          if (mathField.latex() !== currentValue) {
            onChangeRef.current?.(mathField.latex());
          }

          handlers?.edit?.(mq);
        },
      }
    };
  });

  const elementRefCallback = useCallback((element: HTMLSpanElement | null) => {
    if (!element) return;

    assignRef(element, forwardedRef);

    const mathField = mathQuill.MathField(element, createConfig());
    mathField.latex(valueRef.current ?? '');
    mathFieldRef.current = mathField;

    assignRef(mathField, mathFieldActionRef);
  }, []);

  return <span ref={elementRefCallback} {...props} />;
};

function assignRef<Value>(
  value: Value, 
  refObjectOrCallback: ((instance: Value | null) => void) | RefObject<Value | null> | null | undefined
) {
  if (typeof refObjectOrCallback === 'function') {
    refObjectOrCallback(value);
  } else if (refObjectOrCallback) {
    refObjectOrCallback.current = value;
  }
}

function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

const EquationEditor = forwardRef(EquationEditorBase);

export default EquationEditor;
