import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import "./Gallery.scss";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.adjustWidth = this.adjustWidth.bind(this);
    this.getImages = this.getImages.bind(this);
    this.scrollSpy = this.scrollSpy.bind(this);
    this.state = {
      images: [],
      loading: false,
      portion: 0,
      prevTag: "",
      hasMore: true,
      galleryWidth: this.getGalleryWidth(),
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag = "art", portion = 0) {
    this.setState({
      loading: true,
    });
    const perPage = portion === 0 ? 100 : 35;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&page=${portion}`;
    const baseUrl = "https://api.flickr.com/";
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: "GET",
    })
      .then((res) => res.data)
      .then((res) => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          const oldImages = tag === this.state.prevTag ? this.state.images : [];
          this.setState({
            images: [...new Set([...oldImages, ...res.photos.photo])],
            loading: false,
            prevTag: tag,
            portion: portion + 1,
          });
        }
      });
  }

  adjustWidth() {
    this.setState({ galleryWidth: document.body.clientWidth });
  }

  scrollSpy() {
    const tag = this.props && this.props.tag;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      this.getImages(tag);
    }
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.adjustWidth();
    window.addEventListener("resize", this.adjustWidth);
    window.addEventListener("scroll", this.scrollSpy);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.adjustWidth);
    window.removeEventListener("scroll", this.scrollSpy);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="gallery-root">
        {this.state.images.map((dto, i, r) => {
          return (
            <Image
              key={`image-${i}-${dto.id}`}
              dto={dto}
              galleryWidth={this.state.galleryWidth}
              index={i}
            />
          );
        })}
        {loading && (
          <h4 style={{ margin: "100px 0", transition: "250ms" }}>
            Loading images...
          </h4>
        )}
      </div>
    );
  }
}

export default Gallery;
