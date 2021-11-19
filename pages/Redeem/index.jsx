import React from 'react'
import './style.scss'
import { getPacks, redeemCode } from '@api-operations'
import apiConfig from '../../operations/config.json'
import { withRouter } from "react-router-dom";

class Packs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            complete: false,
            success: false
        }
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
    }

    onSubmit(event) {
        event.preventDefault()
        let token = localStorage.getItem("token")
        let code = document.querySelector('#redeem-code').value
        redeemCode(token, code).then((success) => {
            this.setState({
                complete: true,
                success: success
            })
        })
    }

    onReset(event) {
        event.preventDefault()
        this.setState({
            complete: false,
            success: false
        })
    }

    checkCode(string) {
        let reg_exp = /^[0-9a-zA-Z\-]+$/
        let correct = true
        for (let i = 0; i < string.length; i++) {
            if(!string[i].match(reg_exp)) {
                correct = false
                string = string.slice(0, i)
                break
            }
        }
        return correct ? string : this.checkCode(string)
    }

    onChangeInput(event) {
        let input = event.target
        let backspace_pressed = event.nativeEvent.data == null
        let code = input.value.toUpperCase();
        code = this.checkCode(code)
        if((code.length == 4 || code.length == 9) && !backspace_pressed) {
            code += "-"
        }
        input.value = code
    }

    render() {
        return (
            <main className="main page page--redeem">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        {!this.state.complete && 
                            <div className="alert-box_wrap">
                                <div className="alert-box">
                                    <input onChange={this.onChangeInput.bind(this)} id="redeem-code" placeholder="1A34-2B5D-C678" maxLength={14} />
                                    <a href="#submit" className="button" onClick={this.onSubmit.bind(this)}>Submit</a>
                                </div>
                            </div>
                        }
                        {this.state.complete && 
                            <div>
                                {this.state.success &&
                                    <div className="alert-box_wrap">
                                        <div className="alert-box">
                                            <div>Success!</div>
                                            <a href="#reset" onClick={this.onReset.bind(this)} class="button">Redeem another code</a>
                                        </div>
                                    </div>
                                }
                                {!this.state.success &&
                                    <div className="alert-box_wrap">
                                        <div className="alert-box alert-box--error">
                                            <div>Code invalid. If you believe this to be incorrect, contact an admin.</div>
                                            <a href="#reset" onClick={this.onReset.bind(this)} class="button">Try again</a>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Packs)