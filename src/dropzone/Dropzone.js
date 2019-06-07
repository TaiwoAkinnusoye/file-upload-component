import React, {Component} from 'react';

class DropZone extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
    }

    state = {
        highlight: false
    }

    openFileDialog = () => {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }

    onFilesAdded = (event) => {
        if (this.props.disabled) return;
        const files = event.target.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
    }

    fileListToArray = (list) => {
        const array = [];
        for (var i = 0; i < list.length; i++) {
            array.push(list.item(i));
        }
        return array;
    }

    onDragOver = (event) => {
        event.preventDefault();
        if (this.props.disabled) return;
        this.setState({
            highlight: true
        })
    }

    onDragLeave = () => {
        this.setState({
            highlight: false
        })
    }

    onDrop = (event) => {
        event.preventDefault();

        if(this.props.disabled) return;

        const files = event.dataTransfer.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({
            highlight: false
        });
    }

    render () {
        return (
            <div className={`Dropzone ${this.state.highlight ? "Highlight" : ""}`} onClick={this.openFileDialog} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop} style={{cursor: this.props.disabled ? "default" : "pointer"}} >
                <img src="baseline-cloud_upload-24px.svg" alt="Upload" className="Icon" />
                <input ref={this.fileInputRef} className="FileInput" type="file" multiple onChange={this.onFilesAdded} />
                <span>Upload Files</span>
            </div>
        )
    }
};

export default DropZone;