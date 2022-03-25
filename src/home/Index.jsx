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
        return contentLibrary.map(obj => {
            return (
                <div className="col-3 pb-4">
                    <RecipeReviewCard key={obj.id} content={ obj}/>
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
                <dic className="row">
                    {renderMediaLibrary()}
                </dic>
            </div>
        </div>
    );
}

export { Home };