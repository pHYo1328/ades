import { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { StarIcon } from '@heroicons/react/20/solid';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function AdminDashboard() {

    return(
        <div>hi</div>
    )
}
