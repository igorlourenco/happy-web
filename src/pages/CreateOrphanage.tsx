import React, {ChangeEvent, FormEvent, useState} from "react";
import {Map, Marker, TileLayer} from 'react-leaflet';
import {LeafletMouseEvent} from "leaflet";

import {FiPlus} from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../Util/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";

import InputMask from "react-input-mask";

export default function CreateOrphanage() {

    const history = useHistory()

    const [position, setPosition] = useState({latitude: 0, longitude: 0});
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [instructions, setInstructions] = useState("");
    const [opening_hours, setOpeningHours] = useState("");
    const [open_on_weekends, setOpenOnWeekends] = useState(true);
    const [whatsapp, setWhatsapp] = useState("");
    const [instagram, setInstagram] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([])

    function handleMapClick(event: LeafletMouseEvent) {
        const {lat, lng} = event.latlng

        setPosition({
            latitude: lat,
            longitude: lng
        });
    }

    function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
        if (!event.target.files){
            return;
        }

        const selectedImages = Array.from(event.target.files);

        setImages(selectedImages);

        const selectedImagesPreview = selectedImages.map(image => {
            return URL.createObjectURL(image)
        });

        setPreviewImages(selectedImagesPreview);
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {latitude, longitude} = position;

        const finalWhatsapp = whatsapp.replace("-", "").replace(" ", "");

        const data = new FormData();
        data.append("name", name);
        data.append("about", about);
        data.append("latitude", String(latitude));
        data.append("longitude", String(longitude));
        data.append("instructions", instructions);
        data.append("opening_hours", opening_hours);
        data.append("open_on_weekends", String(open_on_weekends));
        data.append("whatsapp", finalWhatsapp);
        data.append("instagram", instagram);

        images.forEach(image => {
            data.append('images', image);
        })

        await api.post('orphanages', data);

        history.push("/app");
    }

    return (
        <div id="page-create-orphanage">
            <Sidebar/>
            <main>
                <form className="create-orphanage-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[-10.2502971, -48.3523869]}
                            style={{width: '100%', height: 280}}
                            zoom={15}
                            onClick={handleMapClick}
                        >
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                            />

                            {position.latitude !== 0 && (
                                <Marker
                                    interactive={false}
                                    icon={mapIcon}
                                    position={[
                                        position.latitude,
                                        position.longitude
                                    ]}
                                />
                            )}
                        </Map>

                        <div className="input-block">
                            <label htmlFor="name">Nome</label>
                            <input
                                id="name"
                                value={name}
                                onChange={event => setName(event.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                            <textarea
                                id="about"
                                value={about}
                                onChange={event => setAbout(event.target.value)}
                                maxLength={300}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>

                            <div className="images-container">
                                {
                                    previewImages.map(previewImage => {
                                        return (
                                            <img src={previewImage} alt={name} key={previewImage}/>
                                        );
                                    })
                                }

                                <label htmlFor="image[]" className="new-image">
                                    <FiPlus size={24} color="#15b6d6"/>
                                </label>
                            </div>
                            <input multiple onChange={handleSelectImages} type="file" id="image[]" />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <div className="input-block">
                            <label htmlFor="instructions">Instruções</label>
                            <textarea
                                id="instructions"
                                value={instructions}
                                onChange={event => setInstructions(event.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="opening_hours">Horário de Funcionamento</label>
                            <input
                                id="opening_hours"
                                value={opening_hours}
                                onChange={event => setOpeningHours(event.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="open_on_weekends">Atende fim de semana</label>

                            <div className="button-select">
                                <button
                                    type="button"
                                    className={open_on_weekends ? "active" : ''}
                                    onClick={() => setOpenOnWeekends(true)}
                                >
                                    Sim
                                </button>

                                <button
                                    type="button"
                                    className={!open_on_weekends ? "active" : ''}
                                    onClick={() => setOpenOnWeekends(false)}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Contato</legend>

                        <div className="input-block">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <InputMask
                                mask="99 99999-9999"
                                id="whatsapp"
                                value={whatsapp}
                                onChange={event => setWhatsapp(event.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="instagram">Instagram</label>
                            <input
                                id="instagram"
                                value={instagram}
                                onChange={event => setInstagram(event.target.value)}
                            />
                        </div>
                    </fieldset>

                    <button className="confirm-button" type="submit">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
