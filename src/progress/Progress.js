import React, {Component} from 'react';

class Progress extends Component {
    constructor(props) {
        super(props)
    }

    state = {}

    render () {
        return (
            <div className="ProgressBar">
                <div className="Progress" style={{width: this.props.progress + '%'}}>
                </div>
            </div>
        )
    }
}

export default Progress;