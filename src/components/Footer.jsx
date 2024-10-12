import React from 'react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import anggaImage from '../assets/images/angga.png'
import giastImage from '../assets/images/giast.jpg'
import devalcoImage from '../assets/images/devalco.jpg'

const DeveloperCard = ({ name, role, imageUrl }) => (
    <div className="flex flex-col items-center p-4">
        <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-full mb-2 object-cover"
        />
        <h3 className="text-accent font-medium">{name}</h3>
        <p className="text-tertiary text-sm mb-2">{role}</p>
        <div className="flex space-x-3">
            <a href="https://github.com/callmeAngga" className="text-accent hover:text-primary transition-colors">
                <Github size={20} />
            </a>
            <a href="https://github.com/callmeAngga" className="text-accent hover:text-primary transition-colors">
                <Linkedin size={20} />
            </a>
            <a href="https://github.com/callmeAngga" className="text-accent hover:text-primary transition-colors">
                <Instagram size={20} />
            </a>
        </div>
    </div>
);

const Footer = () => {
    const developers = [
        {
            name: "Giast Ahmad",
            role: "Frontend Developer",
            imageUrl: giastImage
        },
        {
            name: "Angga Prasetyo",
            role: "Fullstack Developer",
            imageUrl: anggaImage
        },
        {
            name: "Devalco Agazan",
            role: "UI/UX Designer",
            imageUrl: devalcoImage
        }
    ];

    return (
        <footer className="py-3 mt-12 w-full">
            <div className="container mx-auto px-4">
                {/* Team Section */}
                <div className="col-span-1 lg:col-span-2">
                    <h2 className="text-accent text-3xl font-semibold mb-10">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {developers.map((dev, index) => (
                            <DeveloperCard className="text-accent" key={index} {...dev} />
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-tertiary text-center">
                    <p className="text-tertiary">
                        © 2024 Teknik Informatika - Universitas Padjadjaran
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;