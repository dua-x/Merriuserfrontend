import React from 'react'

const Bespoke = () => {
    return (
        <section className="bg-custom-beige py-12 px-6 rounded-xl text-white text-center">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                    <img src="/bespoke.jpg" alt="pic" className="w-full h-48 object-cover rounded-lg" />


                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h2 className="text-2xl font-bold">Bespoke Service</h2>
                    <p className="mt-2 text-sm">
                        You want something truly unique. We offer a bespoke service, allowing you to design a custom dress tailored just for you.
                    </p>
                    <button className="mt-4 bg-white text-[#857B74] px-6 py-2 rounded-lg font-bold hover:bg-gray-200">COMMAND NOW</button>
                </div>
            </div>
        </section >
    );
};




export default Bespoke;
