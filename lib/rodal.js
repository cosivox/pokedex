/* ===============================
 * Rodal v1.5.4 http://rodal.cn
 * =============================== */

//  Modified by Armando Cosilion

import React from 'react';
import PropTypes from 'prop-types';
import '../styles/rodal.css'

// env
const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;

const Dialog = props => {
    const className = `rodal-dialog rodal-${props.animation}-${props.animationType}`;
    const CloseButton = props.showCloseButton ? <span className="rodal-close" onClick={props.onClose} /> : null;
    const { width, height, measure, duration } = props;
    const customStyles = {...props.style, height: 'auto', bottom: 'auto', position: 'relative', maxWidth:"95%", boxSizing:"border-box"}
    const style = {
        width: width + measure,
        height: height + measure,
        animationDuration: duration + 'ms',
        WebkitAnimationDuration: duration + 'ms'
    };
    const mergedStyles = { ...style, ...customStyles };

    return (
        <div ref={props.innerRef} id={props.id} style={mergedStyles} className={className}>
            {CloseButton}
            {props.children}
        </div>
    )
};

class Rodal extends React.Component {

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        measure: PropTypes.string,
        visible: PropTypes.bool,
        showMask: PropTypes.bool,
        closeMaskOnClick: PropTypes.bool,
        showCloseButton: PropTypes.bool,
        animation: PropTypes.string,
        duration: PropTypes.number,
        className: PropTypes.string,
        customStyles: PropTypes.object,
        customMaskStyles: PropTypes.object,
        onClose: PropTypes.func.isRequired,
        onAnimationEnd: PropTypes.func
    };

    static defaultProps = {
        width: 400,
        height: 240,
        measure: 'px',
        visible: false,
        showMask: true,
        closeMaskOnClick: true,
        showCloseButton: true,
        animation: 'zoom',
        duration: 300,
        className: '',
        customStyles: {},
        customMaskStyles: {},
    };

    state = {
        isShow: false,
        animationType: 'leave',
        id: "dialog_" + Date.now()
    };

    static id = 0;


    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.enter();
        } else if (this.props.visible && !nextProps.visible) {
            this.leave();
        }
    }

    componentWillUnmount() {
        if (this.props.visible) {
            this.leave();
        }
    }

    enter() {
        this.setState({
            isShow: true,
            animationType: 'enter'
        });

        if (!document.getElementsByClassName("fixiPhone")[0]) {
            Rodal.ygap = window.pageYOffset || document.documentElement.scrollTop
            document.body.style.top = `${-Rodal.ygap}px`
        }
        document.body.className += " fixiPhone"

    }

    leave() {
        this.setState(isIE9
            ? { isShow: false }
            : { animationType: 'leave' }
        );

        if (document.getElementsByClassName("fixiPhone")[0]) {
            document.body.className = document.body.className.replace(" fixiPhone", "")
        }
        if (!document.getElementsByClassName("fixiPhone")[0]) {
            document.body.style.removeProperty("top")
            window.scrollTo(0, Rodal.ygap)
        }
    }

    animationEnd = () => {
        if (this.state.animationType === 'leave') {
            this.setState({ isShow: false });
        }

        const { onAnimationEnd } = this.props;
        onAnimationEnd && onAnimationEnd();
    }

    componentDidMount() {
        if (this.props.visible) {
            this.enter();
        }
    }

    render() {
        const { props, state } = this;
        const onClick = props.closeMaskOnClick ? checkClick : null;
        const style = {
            display: state.isShow ? '' : 'none',
            animationDuration: props.duration + 'ms',
            WebkitAnimationDuration: props.duration + 'ms'
        };

        if (!this.id) {
            this.id = "dialog_" + Rodal.id
            Rodal.id++
            if (this.props.idCallback)
                this.props.idCallback(this.id)
        }
        let id = this.id

        let moving = false
        function checkClick(event) {
            if (document.getElementsByClassName("autocomplete-suggestions").length == 0 && !moving && !document.getElementById(id).contains(event.target) && document.getElementsByClassName("rc-time-picker-panel").length == 0)
                props.onClose()
        }

        return (
            <div style={style}
                className={"rodal rodal-fade-" + state.animationType + ' ' + props.className}
                onAnimationEnd={this.animationEnd}
            >
                {props.showMask &&
                    <div id={"mask-" + this.id} className="rodal-mask" style={props.customMaskStyles} onTouchMove={() => { moving = true }} onTouchStart={() => { moving = false }} onTouchEnd={onClick} onMouseDown={onClick}>
                        {this.state.isShow && <Dialog innerRef={ref => this.dialog = ref} id={id} {...props} animationType={state.animationType}>
                            {props.children}
                        </Dialog>}
                    </div>
                    ||
                    <Dialog {...props} animationType={state.animationType}>
                        {props.children}
                    </Dialog>}
            </div>
        )
    }
}

export default Rodal;
