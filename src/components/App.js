import React, { Component } from 'react';
import Web3 from 'web3';
import Degree from '../abis/Storage.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Degree.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Degree.abi, networkData.address)
      this.setState({ contract })
      const degreeHash = await contract.methods.get().call()
      this.setState({ degreeHash })
      this.setState({ buffer: false })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      degreeHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      confirm: true
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    console.log(event.target.files.length)
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()

    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account })
       this.state.contract.methods.get().call().then(
        this.setState({ confirm: true }))
      //  this.setState({ degreeHash: result[0].hash })
    })
  }

  render() {
    var conditional = <p>Submit a Document/Image</p>
    var done = <p></p>
    if(this.state.degreeHash !== ''){
      conditional = <div>
          <h3>Click on the Link or the Button to view the Document</h3>
          <hr></hr>
          <a
            href={`https://ipfs.infura.io/ipfs/${this.state.degreeHash}`}
            onClick={this.documentloading}
            target="_blank"
            rel="noopener noreferrer"
          > 
            <button className="btn btn-primary btn-sm">View</button>
          </a>
            <hr></hr>
            <h3>OR</h3>
            <hr></hr>
            <a href={`https://ipfs.infura.io/ipfs/${this.state.degreeHash}`}
               target="_blank"
               rel="noopener noreferrer"
            >
              {`https://ipfs.infura.io/ipfs/${this.state.degreeHash}`}
            </a>
        </div>

      if(this.state.confirm == true){
        done = <a href="javascript:history.go(0)">Click to refresh the page</a>         
      }
    }
     // eslint-disable-next-line
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            rel="noopener noreferrer"
          >
            {this.state.account}
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {conditional}
                
                <p>&nbsp;</p>
                <h2>Upload a File</h2>
                <p>&nbsp;</p>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} multiple/>
                  <input type='submit' />
                  <hr></hr>
                  <a href="javascript:history.go(0)">Click to refresh the page</a>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
