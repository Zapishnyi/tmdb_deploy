// View transition declaration
declare interface Document {
  startViewTransition?: (callback: () => void) => void;
}