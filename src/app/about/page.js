// app/about/page.js
import Head from 'next/head';

export default function AboutPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            <main>
                <h1 style={{ color: '#333' }}>About Us</h1>
                <p style={{ color: '#666' }}>Welcome to our website! We are a passionate team dedicated to providing the best services to our customers.</p>
                <h2 style={{ color: '#333' }}>Our Mission</h2>
                <p style={{ color: '#666' }}>Our mission is to create innovative solutions that improve the lives of our users.</p>
                <h2 style={{ color: '#333' }}>Our Team</h2>
                <p style={{ color: '#666' }}>We are a group of professionals with diverse backgrounds and expertise, working together to achieve our common goals.</p>
                <h2 style={{ color: '#333' }}>Contact Us</h2>
                <p style={{ color: '#666' }}>If you have any questions or would like to learn more about our work, feel free to <a href="/contact" style={{ color: 'blue' }}>contact us</a>.</p>
            </main>
        </div>
    );
}
