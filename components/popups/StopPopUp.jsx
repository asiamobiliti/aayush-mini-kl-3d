import '../../componentStyles/PopUp.css';
import { fetchETASchedule } from '../../utils';
import stopsData from '../../data/stops.json';
import stopTimingsData from '../../data/stopTimings.json';


export default function StopPopUp({ data }) {
    //console.log(data);
    const staticEtas = fetchETASchedule(data.stop_id, stopsData, stopTimingsData);
    return (
        <div className="pop-up-default">
        <div><strong>{data.name}</strong></div>
        <hr className='stop-horizontal-row-style' />
        <div style={{ textAlign: "justify", margin: "4px" }}>
            {data?.buses && data.buses.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <thead>
                <tr>
                    <th style={{ textAlign: 'left', padding: '4px' }}>Bus</th>
                    <th style={{ textAlign: 'left', padding: '4px' }}>ETA</th>
                </tr>
                </thead>
            </table>
            ) : (
            <div>No buses available</div>
            )}

            {data?.buses && data.buses.length > 0 && (
            <div style={{ maxHeight: '350px', overflowY: 'auto', zIndex:'20' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {data.buses.map((bus, index) => (
                    <tr key={index}>
                        <td style={{ padding: '4px' }}>{bus.route_id}</td>
                        <td style={{ padding: '4px' }}>
                        
                        {staticEtas && staticEtas[bus.route_id] ? staticEtas[bus.route_id] : 'N/A'}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    );
}
