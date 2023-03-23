import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from 'react-loader-spinner'

import { Container } from './App.styled';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { ImageGalleryItem } from "components/ImageGalleryItem/ImageGalleryItem";
import { Button } from 'components/Button/Button';

export class App extends Component {
	state = {
		searchValue: '',
		cards: false,
		page: 1,
		loading: false,
	}

	getSearchValue = (value) => {
		this.setState({
			searchValue: value,
			page: 1
		})
	}

	getCardsAndLoadStatus = (cards, loading) => {
		this.setState({
			cards,
			loading
		});
	}

	loadMoreClick = (e) => {
		this.setState(prevState => {
			return {
				page: prevState.page + 1,
			}
		})
	}

	render() {
		const { searchValue, page } = this.state;

		return (
			<Container>
				<ToastContainer
					autoClose={3000}
				/>

				<Searchbar onSubmit={this.getSearchValue} />
				<ImageGallery>
					<ImageGalleryItem
						searchValue={searchValue}
						getCardsAndLoadStatus={this.getCardsAndLoadStatus}
						page={page}
					/>
				</ImageGallery>

				<Triangle
					height="60"
					width="60"
					color="#4fa94d"
					ariaLabel="triangle-loading"
					wrapperStyle={{}}
					wrapperClassName=''
					visible={this.state.loading}
				/>

				{this.state.cards && <Button onClick={this.loadMoreClick} />}
			</Container>
		);
	}
};
