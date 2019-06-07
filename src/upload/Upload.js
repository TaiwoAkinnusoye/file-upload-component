import React, {Component} from 'react';
import axios from 'axios';
import './Upload.css';
import DropZone from '../dropzone/Dropzone';
import Progress from '../progress/Progress';

class Upload extends Component {
    constructor (props) {
        super(props);
        this.uploadFiles = this.uploadFiles.bind(this);
    }

    state = {
        files: [],
        uploading: false,
        uploadProgress: {},
        successfulUploaded: false
    }

    onFilesAdded = (files) => {
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
    }

    renderProgress = (file) => {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfulUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
                    <img className="CheckIcon" alt="done" src="../../public/baseline-check_circle_outline-24px.svg" style={{opacity: uploadProgress && uploadProgress.state === "done" ? 0.5 : 0}} />
                </div>
            )
        }
    }

    renderActions = () => {
        if (this.state.successfulUploaded) {
            return (
                <button onClick={() => this.setState({files: [], successfulUploaded: false})}>Clear</button>
            );
        } else {
            return (
                <button disabled={this.state.files.length < 0 || this.state.uploading} onClick={this.uploadFiles} >Upload</button>
            )
        }
    }
    
    // async uploadFiles () {
    //     this.setState({uploadProgress: {}, uploading: true});
    //     const promises = [];
    //     this.state.files.forEach(file => {
    //         promises.push(this.sendRequest(file));
    //     });
    //     try {
    //         await Promise.all(promises);

    //         this.setState({successfulUploaded: true, uploading: false});
    //     } catch (e) {
    //         this.setState({successfulUploaded: true, uploading: false});
    //     }
    // }

    uploadFiles = () => {
        this.setState({uploadProgress: {}, uploading: true});
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
        });
        axios.post('http://localhost:8000/upload', promises).then(res => {
            console.log(res);
        })
    }

    sendRequest = (file) => {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener('progress', event => {
                if (event.lengthComputable) {
                    const copy = {...this.state.uploadProgress};
                    copy[file.name] = {
                        state: 'pending',
                        percentage: (event.loaded / event.total) * 100
                    };
                    this.setState({uploadProgress: copy});
                }
            });
            req.upload.addEventListener("load", event => {
                const copy = {...this.state.uploadProgress};
                copy[file.name] = {
                    state: 'done',
                    percentage: 100
                };
                this.setState({uploadProgress: copy});
                resolve(req.response);
            });
            req.upload.addEventListener('error', event => {
                const copy = {...this.state.uploadProgress};
                copy[file.name] = {
                    state: 'error',
                    percentage: 0
                };
                this.setState({uploadProgress: copy});
                reject(req.response);
            });

            const formData = new FormData();
            formData.append('file', file, file.name);

            req.open('POST', 'http://localhost:8000/upload');
            req.send(formData);                                                                                                                                       
        })
    }

    render () {
        return (
            <div className="Upload">
                <span className="Title">Upload Files</span>
                <div className="Content">
                    <div>
                        <DropZone onFilesAdded={this.onFilesAdded} disabled={this.state.uploading || this.state.successfulUploaded} />
                    </div>
                </div>
                <div className="Files">
                    {this.state.files.map(file => {
                        return (
                            <div key={file.name} className="Row">
                                <span className="Filename">{file.name}</span>
                                {this.renderProgress(file)}
                            </div>
                        );
                    })}
                </div>
                <div className="Actions">
                    {this.renderActions()}
                </div>
            </div>
        )
    }
}

export default Upload;

