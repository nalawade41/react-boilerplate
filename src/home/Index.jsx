import React, {useEffect, useState} from 'react';

import { accountService, contentService } from '@/_services';
import { RecipeReviewCard } from '@/_components';

function Home() {
    const user = accountService.userValue;
    const [contentLibrary, setContentLibrary] = useState([]);

    useEffect(() => {
        loadContentLibrary();
    },[]);

    const loadContentLibrary = () => {
        contentService.getAll({}).then((content) => {
            setContentLibrary(content.data);
        });
    }

    const renderMediaLibrary = () => {
        return contentLibrary.map((obj, index) => {
            return (
                <div key={obj.id} className="col-3 pb-4">
                    <RecipeReviewCard content={ obj}/>
                </div>
            );
        })  
    };
    
    if (!contentLibrary || (contentLibrary && contentLibrary.length === 0)) {
        return (<></>);
    }

    return (
        <div className="p-4">
            <div className="container">
                <div className="row">
                    {renderMediaLibrary()}
                </div>
            </div>
        </div>
    );
}

export { Home };