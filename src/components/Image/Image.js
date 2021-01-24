import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import Viewer from "react-viewer";
import "react-viewer/dist/index.css";
import "./Image.scss";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.expandImage = this.expandImage.bind(this);
    this.angle = [0, 90, 180, 270];
    this.state = {
      size: 200,
      turns: 0,
      deleted: false,
      expanded: false,
    };
  }

  rotateImage() {
    this.setState({ turns: this.state.turns + 1 });
  }

  deleteImage() {
    this.setState({ deleted: true });
  }

  expandImage() {
    this.setState({ expanded: !this.state.expanded });
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size,
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    const { turns, deleted, expanded } = this.state;
    const angle = this.angle[turns % 4];
    const imageClass = `image-root ${deleted && "image-hidden"}`;
    return (
      <div
        className={imageClass}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + "px",
          height: this.state.size + "px",
          transform: `rotate(${angle}deg)`,
        }}
      >
        {/* Modal Image View */}
        <Viewer
          visible={expanded}
          noToolbar={true}
          images={[{ src: this.urlFromDto(this.props.dto), alt: "" }]}
          style={{
            transform: `rotate(${angle}deg) !important`,
          }}
          onClose={() => {
            this.setState({ expanded: false });
          }}
        />

        <div
          style={{
            transform: `rotate(-${angle}deg)`,
          }}
        >
          <FontAwesome
            onClick={() => this.rotateImage()}
            className="image-icon"
            name="sync-alt"
            title="rotate"
          />
          <FontAwesome
            onClick={() => this.deleteImage()}
            className="image-icon"
            name="trash-alt"
            title="delete"
          />
          <FontAwesome
            onClick={() => this.expandImage(this.props.dto.id)}
            className="image-icon"
            name="expand"
            title="expand"
          />
        </div>
      </div>
    );
  }
}

export default Image;
