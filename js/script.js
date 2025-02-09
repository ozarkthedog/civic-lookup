.officials-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 40px;
}

/* Card Styling */
.official-card {
    width: 466px;
    height: 556px;
    background: #FFFFFF;
    box-shadow: 0px 4px 8px rgba(171, 190, 209, 0.4);
    border-radius: 10px;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

/* Profile Image */
.official-img {
    width: 100px;
    height: 100px;
    background: #D9D9D9;
    border-radius: 12px;
    position: absolute;
    left: 30px;
    top: 27px;
}

/* Name */
.official-card h3 {
    font-family: 'Roboto Flex', sans-serif;
    font-weight: 500;
    font-size: 24px;
    color: #000000;
    position: absolute;
    left: 149px;
    top: 27px;
    width: 290px;
    text-align: left;
}

/* Title (U.S. Senator) */
.official-card p.title {
    font-family: 'Roboto Flex', sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    position: absolute;
    left: 149px;
    top: 58px;
    width: 290px;
    text-align: left;
}

/* Party Tag */
.party {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 28px;
    background: #FFE5E5;
    color: #C70000;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    position: absolute;
    left: 146px;
    top: 99px;
}

/* Democrat Party */
.party.democrat {
    background: #E5ECFF;
    color: #0033CC;
}

/* Office Info */
.office-info {
    position: absolute;
    left: 31px;
    width: 350px;
    font-family: 'Roboto Flex', sans-serif;
    font-size: 16px;
}

.office-info p {
    display: flex;
    justify-content: space-between;
    color: #717171;
    margin: 5px 0;
}

.office-info p span {
    color: #000000;
}

/* Buttons */
.website-btn {
    width: 395px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #D10062;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #D10062;
    text-decoration: none;
    margin-top: 40px;
    transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
}

.website-btn:hover {
    background: #D10062;
    color: white;
}

/* Call Office Button */
.call-btn {
    width: 395px;
    height: 50px;
    background: #D10062;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.call-btn:hover {
    background: #B80052;
}

/* Social Media Icons */
.social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    position: absolute;
    top: 497px;
}

.social-icons img {
    width: 40px;
    transition: transform 0.2s ease-in-out;
}

.social-icons img:hover {
    transform: scale(1.1);
}
