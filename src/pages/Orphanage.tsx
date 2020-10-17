import React, {useEffect, useState} from "react";
import {FaWhatsapp, FaInstagram} from "react-icons/fa";
import {FiClock, FiInfo} from "react-icons/fi";
import {Map, Marker, TileLayer} from "react-leaflet";
import {useParams} from 'react-router-dom';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../Util/mapIcon";
import api from "../services/api";

interface Orphanage {
    name: string;
    latitude: number;
    longitude: number;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: boolean;
    whatsapp: string;
    instagram: string;
    images: Array<{
        id: number;
        url: string
    }>;
}

interface OrphanageParams {
    id: string;
}

export default function Orphanage() {

    const params = useParams<OrphanageParams>();

    const [orphanage, setOrphanage] = useState<Orphanage>();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        api.get(`orphanages/${params.id}`).then(response => {
            setOrphanage(response.data);
        });
    }, [params.id, activeImageIndex]);

    if (!orphanage) {
        return <h2>carregando...</h2>
    }

    return (
        <div id="page-orphanage">
            <Sidebar/>

            <main>
                <div className="orphanage-details">
                    <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name}/>

                    <div className="images">
                        {
                            orphanage.images.map((image, index) => {
                                return (
                                    <button
                                        key={image.id}
                                        className={activeImageIndex === index ? "active" : ""}
                                        type="button"
                                        onClick={() => {
                                            setActiveImageIndex(index)
                                        }}
                                    >
                                        <img src={image.url} alt={orphanage?.name}/>
                                    </button>
                                )
                            })
                        }
                    </div>

                    <div className="orphanage-details-content">
                        <h1>{orphanage.name}</h1>
                        <p>{orphanage.about}</p>

                        <div className="map-container">
                            <Map
                                center={[orphanage.latitude, orphanage.longitude]}
                                zoom={16}
                                style={{width: '100%', height: 280}}
                                dragging={false}
                                touchZoom={false}
                                zoomControl={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                            >
                                <TileLayer
                                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                                />
                                <Marker interactive={false} icon={mapIcon}
                                        position={[orphanage.latitude, orphanage.longitude]}/>
                            </Map>

                            <footer>
                                <a target="_blank" rel="noreferrer noopener"
                                   href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver
                                    rotas no Google Maps</a>
                            </footer>
                        </div>

                        <hr/>

                        <h2>{orphanage.instructions}</h2>
                        <p>Venha como se sentir mais à vontade e traga muito amor para dar.</p>

                        <div className="open-details">
                            <div className="hour">
                                <FiClock size={32} color="#15B6D6"/>
                                {orphanage.opening_hours}
                            </div>

                            {orphanage.open_on_weekends ? (<div className="open-on-weekends">
                                <FiInfo size={32} color="#39CC83"/>
                                Atendemos <br/>
                                no fim de semana
                            </div>) : (<div className="open-on-weekends dont-open">
                                <FiInfo size={32} color="#FF669D"/>
                                Não atendemos <br/>
                                no fim de semana
                            </div>)}
                            9
                        </div>

                        <a href={`https://wa.me/55${orphanage.whatsapp}`} target="_blank">
                            <button type="button" className="contact-button whatsapp">
                                <FaWhatsapp size={20} color="#FFF"/>
                                Entre em contato
                            </button>
                        </a>

                        <a href={`https://www.instagram.com/${orphanage.instagram}`} target="_blank">
                            <button type="button" className="contact-button instagram">
                                <FaInstagram size={20} color="#FFF"/>
                                Veja no Instagram
                            </button>
                        </a>

                    </div>
                </div>
            </main>
        </div>
    );
}