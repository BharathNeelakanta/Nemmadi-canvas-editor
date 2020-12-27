import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import ImageMapEditor from '../components/imagemap/ImageMapEditor';
import WorkflowEditor from '../components/workflow/WorkflowEditor';
import Title from './Title';
import './App.css';
import { BrowserRouter, Route } from "react-router-dom"
import Login from "../components/Login/Login"
import ListingProjects from "../components/Completed_projects/ListingProjects"
import ListingFloors from "../components/Floors/FloorListing"
import CreateFloorModal from "../components/Floors/CreateFloorModal"
import Create_Modal from "../components/Create_Modal"
import People from "../components/People"
// import Canvas from "../SidePane/SidePane"
// import Canvas1 from "../SidePane/SidePane1"
import projectDetails from "../components/Completed_projects/projectDetails"

class App extends Component {
    state = {
        current: 'imagemap',
    }

    onChangeMenu = ({ key }) => {
        this.setState({
            current: key,
        });
    }

    render() {
        const { current } = this.state;

        return (
            <BrowserRouter>
            <div >
              <Helmet>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Nemmadi" />
                    {/* <link rel="manifest" href="./manifest.json" /> */}
                    <link rel="shortcut icon" href="./favicon.ico" />
                    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"/>                    

                    {/* <link rel="stylesheet" href="https://fontπs.googleapis.com/earlyaccess/notosanskr.css" /> */}
                    {/* <title>React Design Editor</title> */}
                    {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" /> */}
                    {/* <script>
                        {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-97485289-3');
                        `}
                    </script> */}
                    {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" /> */}
                </Helmet>
                <Route path="/" component={Login} exact={true}></Route>
                <Route path="/listingProjects" component={ListingProjects}></Route>
                <Route exact path="/people" component={People}></Route>
                <Route path="/listingFloor/:projectName/:projectid" component={ListingFloors}></Route>
                <Route path="/createFloor" component={CreateFloorModal}></Route>
                <Route path="/create_Modal" component={Create_Modal}></Route>
                <Route path="/create_Modal" component={Create_Modal}></Route>
                <Route path="/Canvas/:projectName/:floorid" component={ImageMapEditor}></Route>
                {/* <Route path="/Canvas1/:projectName/:floorid" component={Canvas1}></Route> */}
                {/* <Route path="/Createproject" component={Createproject}></Route> */}
                <Route path="/projectDetails/:projectid" component={projectDetails} ></Route>
        
              </div>
            </BrowserRouter>
          )

        // return (
        //     <div className="rde-main">
        //     <div className="rde-content">
        //         <Helmet>
        //             <meta charSet="utf-8" />
        //             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //             <meta name="description" content="React Design Editor has started to developed direct manipulation of editable design tools like Powerpoint, We've developed it with react.js, ant.design, fabric.js " />
        //             <link rel="manifest" href="./manifest.json" />
        //             <link rel="shortcut icon" href="./favicon.ico" />
        //             <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
        //             <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
        //             {/* <title>React Design Editor</title> */}
        //             {/* <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" /> */}
        //             {/* <script>
        //                 {`
        //                 window.dataLayer = window.dataLayer || [];
        //                 function gtag(){dataLayer.push(arguments);}
        //                 gtag('js', new Date());
        //                 gtag('config', 'UA-97485289-3');
        //                 `}
        //             </script> */}
        //             {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" /> */}
        //         </Helmet>
        //         <div className="rde-content">
        //         <BrowserRouter>
        //      <Route path="/sanju/2/s" component={ImageMapEditor}></Route>

        //         </BrowserRouter>
        //             {/* {
        //                 current === 'imagemap' ? (
        //                     <ImageMapEditor />
        //                 ) : (
        //                     <WorkflowEditor />
        //                 )
        //             } */}
        //         </div>
        //     </div>
        //     </div>
        // );
    }
}

export default App;
