import { apiKey } from './apiKey';

declare var ol: any;

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

type GeocodingResponse = {
    items: { position: { lat: number; lng: number } }[];
};

const searchAddressHandler = async (event: Event) => {
    event.preventDefault();
    const enteredAddress = addressInput.value.split(' ').join('+');

    try {
        const data = await fetch(
            `https://geocode.search.hereapi.com/v1/geocode?q=${enteredAddress}&apiKey=${apiKey}`
        );

        const response: GeocodingResponse = await data.json();
        const coordinates = response.items[0].position;
        console.log(response);

        document.getElementById('map')!.innerHTML = '';
        new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                }),
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
                zoom: 16,
            }),
        });
    } catch (err) {
        console.error(err);
    }
};

form.addEventListener('submit', searchAddressHandler);
