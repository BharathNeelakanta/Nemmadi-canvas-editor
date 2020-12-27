import React, { Component } from "react";
import "./Filter.css";
import search from "../Assets/icon Nemmadi/search.png";

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("this.props from filter===>", this.props);
    return (
      <React.Fragment>
        <div id="myFilternav" className="filternav">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <h5>Filter</h5>
              </div>
              <div className="col-4">
                <span
                  className="cancel-btn"
                  onClick={this.props.handleFilter}
                >
                  Reset
                </span>
                
                    {/* <button className="btn btn-default closebtn" onClick={() => this.props.handleFilter(false)}>X</button> */}
              </div>
              <div className="col-4">
                <span className="apply-btn" onClick={() => this.props.handleFilter(false)}>Close</span>
                {/* <!-- <button className="btn btn-primary">Apply</button> --> */}
              </div>
            </div>
          </div>
          <hr />
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h5>Location</h5>
              </div>
              <div className="col-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <img src={search} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={this.props.search}
                    onChange={this.props.handleFilterChange}
                    className="form-control inputsss"
                    placeholder="Ex:Bangalore,Hyderbad.."
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <h5>Builder</h5>
              </div>
              <div className="col-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <img src={search} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name={this.props.builder}
                    value={this.props.filterBuilder}
                    onChange={this.props.handleBuilder}
                    className="form-control inputsss"
                    placeholder="Ex:Prestige,SKR.."
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <h5>Type</h5>
              </div>
              <div className="col-12">
              <ul className="list_of_search">
                    {this.props.projectTypes.map(({ id, name }) => (
                        <li key={id}>
                          <input type="checkbox" name={id} id={id} onChange={this.props.handleProject} />
                            <label htmlFor={id}  onChange={this.props.handleProject} >
                                { name }
                            </label>
                        </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* <div className="row mt-2">
              <div className="col-12">
                <h5>Carpet area in Sqft</h5>
              </div>
              <div className="col-12 slidecontainer">
                <span className="pull-left">0</span>
                <span className="float-right">100</span>
                <input
                  type="range"
                  min="20"
                  className="form-control"
                  max="100"
                  value="50"
                />
              </div>
            </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Filter;