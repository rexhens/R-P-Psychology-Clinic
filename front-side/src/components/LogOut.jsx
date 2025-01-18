export default function LogOut(){
localStorage.removeItem('apiKey');
    window.location.href = '/login'
    return (
        <>
        
        </>

    )
}