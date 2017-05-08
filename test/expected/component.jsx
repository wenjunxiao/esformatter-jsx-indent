const FadingRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    <Component {...props} />
  )} />
)