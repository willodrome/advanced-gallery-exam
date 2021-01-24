import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.adjustWidth = this.adjustWidth.bind(this);
    this.state = {
      images: [],
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

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
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
          this.setState({ images: res.photos.photo });
        }
      });
  }

  debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  adjustWidth() {
    this.setState({ galleryWidth: document.body.clientWidth });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.adjustWidth();
    window.addEventListener("resize", this.adjustWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.adjustWidth);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto) => {
          return (
            <Image
              key={"image-" + dto.id}
              dto={dto}
              galleryWidth={this.state.galleryWidth}
            />
          );
        })}
      </div>
    );
  }
}

export default Gallery;
