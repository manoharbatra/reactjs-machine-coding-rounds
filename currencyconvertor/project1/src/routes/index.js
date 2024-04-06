import {Suspense, Fragment} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { PublicRoutes } from './routes.js';

function AppRoutes() {
  return (
    <Router>
        <Fragment>
            <Suspense fallback={<div>Subscibe to Manohar Batra YT Channel...</div>}>
                <Routes>                       
                    {PublicRoutes.map(({component: Component, slug, exact}, index) => (
                        <Route path={`${slug}`} key={index} exact element={<Component />}/>
                    ))}
                </Routes>
            </Suspense>
        </Fragment>
    </Router>
  );
}

export default AppRoutes;