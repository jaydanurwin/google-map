import { html, css, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMapMarker } from './GoogleMapMarker';

@customElement('google-map')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    #map {
      width: 100%;
      height: 350px;
    }
  `;

  @property({ type: String, reflect: true, attribute: 'apikey' })
  apiKey = '';

  @property({ type: Number })
  lat: number = 0;

  @property({ type: Number })
  lng: number = 0;

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

  private _init() {
    this.loader = new Loader({
      apiKey: this.apiKey,
      version: 'weekly',
    });
    this.loader.load().then(() => {
      this.map = new google.maps.Map(this.mapContainer, {
        center: { lat: this.lat, lng: this.lng },
        zoom: 13,
      });
    });
  }

  render() {
    return html` <div id="map"></div> `;
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
    'google-map': MyElement;
  }
}
