'use client'
import styles from "./page.module.scss";
import PostEditor from '../components/PostEditor';


export default function Home() {

    const handleSave = async (postContent) => {
        // Here, you would typically send the postContent to your backend API
        console.log('Post saved!', postContent);

    };

    return (
        <main className={styles.main}>
            profiledd
            <h2>Create a New Post</h2>
            <PostEditor onSave={handleSave} />

        </main>
    );
}
