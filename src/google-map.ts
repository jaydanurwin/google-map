import { html, css, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMapMarker } from './GoogleMapMarker';

export { Loader } from '@googlemaps/js-api-loader';
export { GoogleMapMarker } from './GoogleMapMarker';

@customElement('google-map')
export class GoogleMap extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #map {
      width: inherit;
      height: inherit;
    }
  `;

  @property({ type: String, reflect: true, attribute: 'apikey' })
  apiKey = '';

  @property({ type: Number, reflect: true, attribute: 'lat' })
  lat: number = 0;

  @property({ type: Number, reflect: true, attribute: 'lng' })
  lng: number = 0;

  @property({ type: Number, reflect: true, attribute: 'zoom' })
  zoom = 10;

  @property({ type: Array, attribute: 'map-styles' })
  mapStyles = [];

  @state()
  loader!: Loader;

  @state()
  googleMapMarkers: GoogleMapMarker[] = [];

  @state()
  map!: google.maps.Map;

  @query('#map')
  mapContainer!: HTMLDivElement;

  connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private _init() {
    this.loader = new Loader({
      apiKey: this.apiKey,
      version: 'weekly',
    });
    this.loader.load().then(() => {
      this.map = new google.maps.Map(this.mapContainer, {
        center: { lat: this.lat, lng: this.lng },
        zoom: this.zoom,
        styles: this.mapStyles,
      });
    });
  }

  render() {
    return html`
      <div id="map"></div>
    `;
  }

  public addMarkers(markers: GoogleMapMarker[]) {
    this.googleMapMarkers.push(...markers);

    this.loader
      ?.load()
      .then(() => {
        // for each marker we'll create a new marker
        this.googleMapMarkers.forEach((marker) => {
          new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: this.map,
            icon: marker.icon,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'google-map': GoogleMap;
  }
}
