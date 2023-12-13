import React from 'react'
import BeatLoader from 'react-spinners/BeatLoader';

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
 }

 componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 5000);
 }
 render() {
  return (
    <div>
<div className="container">
        {this.state.loading ? (
          <BeatLoader color="#36D7B7" loading={this.state.loading} size={20} />
        ) : (
          <h1>Content loaded successfully!</h1>
        )}
      </div>

    </div>
  )
        }
}
