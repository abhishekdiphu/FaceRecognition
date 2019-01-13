import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Registration from './Components/Registration/Registration';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
    apiKey: '7896797e6a784bbbbbf567fe9f825b30'
});

const ParticlesOptions = {
    particles: {
        number:{
            value:300,
            density: {
                enable: true,
                value_area:900
            }

        }
    }
}

class App extends Component {
    constructor(){
        super();
        this.state={
            input:'',
            imageUrl :'',
            box :{},
            route : 'signin',
            isSignedIn : false,
            user:{
                id: '',
                name: '',
                email :'',
                entries :0,
                joined:''
            }

        }

    }

    loadUser =(data)=> {
        this.setState({user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined

            }})
    }

    onRouteChange = (route) => {
        if (route ==='signout'){
            this.setState({isSignedIn :false})
        } else if (route ==='home') {
            this.setState({isSignedIn :true})
        }
        this.setState({route : route});
    }

    calculateFaceLocation =(data) => {
        const  clarifiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width =Number(image.width);
        const height =Number(image.height);
        return {
            leftCol : clarifiFace.left_col*width,
            topRow :  clarifiFace.top_row*height,
            rightCol : width -(clarifiFace.right_col*width),
            bottomRow : height -(clarifiFace.bottom_row*height),

        }
    }

    displayFaceBox =(box)=> {
        console.log(box);
        this.setState({box:box});
    }

    onInputChange =(event) => {
        this.setState({input :event.target.value});
    }

    onButtonSubmit =() => {
        this.setState({imageUrl:this.state.input});

        console.log('click');
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL,
            this.state.input)
            .then( response => {


                if(response){
                fetch('http://localhost:8000/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })

                })
                    .then(response => response.json())
                    .then(count => {
                        this.setState(Object.assign(this.state.user, {entries: count}))
                    })
            }

            this.displayFaceBox(this.calculateFaceLocation(response))
             })
            .catch(err => console.log(err));
}
  render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
          <Particles className="particles"
              params={ParticlesOptions}

          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          {
              route === 'home'
              ? <div>
                  <Logo/>
                  < Rank name={this.state.user.name} entries={this.state.user.entries} />
                  < ImageLinkForm
                      onInputChange = {this.onInputChange}
                      onButtonSubmit ={this.onButtonSubmit}/>
                  < FaceRecognition
                      box={box} imageUrl={imageUrl}/>
              </div>

              :(
                  route === 'signin'
                      ? < SignIn loadUser = {this.loadUser} onRouteChange ={this.onRouteChange} />
                      : < Registration  loadUser = {this.loadUser} onRouteChange ={this.onRouteChange} />
              )


              }
              </div>
    );
  }
}

export default App;
