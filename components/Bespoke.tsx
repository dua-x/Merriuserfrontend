import React from 'react';

const Bespoke = () => {
    return (
        <section className="bg-custom-beige py-12 px-6 rounded-xl text-white text-center relative opacity-80">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white text-md font-bold px-4 py-1 rounded-full">
                Bientôt Disponible
            </div>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                    <img src="/bespoke.jpg" alt="Service sur-mesure" className="w-full h-48 object-cover rounded-lg opacity-50" />
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h2 className="text-2xl font-bold text-custom-brown">Service Bespoke </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Vous souhaitez quelque chose d'unique ? Notre service sur-mesure arrive bientôt !
                        Créez votre robe personnalisée adaptée à vos envies.
                    </p>
                    <button 
                        className="mt-4 bg-custom-biege text-custom-brown px-6 py-2 rounded-lg font-bold border border-custom-brown cursor-not-allowed"
                        disabled
                    >
                        COMMANDER BIENTÔT
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Bespoke;
