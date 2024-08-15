import { Switch, Route } from 'wouter'
import { ResizeScreen } from './screens/ResizeScreen'
import ContactSheetScreen from './screens/ContactSheetScreen'

export default function MainRouter() {
  return (
    <Switch>
      <Route path="/" component={ResizeScreen} />
      <Route path="/contact-sheet" component={ContactSheetScreen} />
    </Switch>
  )
}