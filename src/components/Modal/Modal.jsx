import { Component } from "react";
import { Overlay } from "./Modal.styled";


export class Modal extends Component {
	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown = (e) => {
		if (e.code === 'Escape') {
			this.props.onClick();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}

	render() {
		const { onClick, url, alt } = this.props;

		return (
			<div onClick={onClick}>
				<Overlay>
					<div className="modal">
						<img id='largeImg' src={url} alt={alt} />
					</div>
				</Overlay>
			</div>
		)
	}
}