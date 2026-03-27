import { createNavigationContainerRef, CommonActions, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

function setContainer() {
  // no-op: NavigationContainer ref is managed by navigationRef
}

function reset(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      }),
    );
  }
}

function navigate(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate({ name: routeName, params }));
  }
}

function navigateDeep(actions) {
  if (!navigationRef.isReady()) return;
  const deepAction = actions.reduceRight(
    (prevAction, action) =>
      CommonActions.navigate({
        name: action.routeName,
        params: action.params,
        state: prevAction ? { routes: [prevAction] } : undefined,
      }),
    undefined,
  );
  navigationRef.dispatch(deepAction);
}

function getCurrentRoute() {
  if (!navigationRef.isReady()) return null;
  let state = navigationRef.getRootState();
  if (!state) return null;
  while (state.routes && state.index !== undefined) {
    const activeRoute = state.routes[state.index];
    if (activeRoute && activeRoute.state) {
      state = activeRoute.state;
    } else {
      break;
    }
  }
  return state;
}

function back() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

function pop(number) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(number || 1));
  }
}

function push(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
}

export default {
  setContainer,
  navigateDeep,
  navigate,
  reset,
  getCurrentRoute,
  back,
  pop,
  push,
};