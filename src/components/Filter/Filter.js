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
        <div id="myFilternav" class="filternav">
          <div class="container">
            <div class="row">
              <div class="col-4">
                <h5>Filter</h5>
              </div>
              <div class="col-4">
                <span
                  class="cancel-btn"
                  onClick={this.props.handleFilter}
                >
                  Cancel
                </span>
                
                    {/* <button class="btn btn-default closebtn" onClick={() => this.props.handleFilter(false)}>X</button> */}
              </div>
              <div class="col-4">
                <span class="apply-btn" onClick={() => this.props.handleFilter(false)}>Close</span>
                {/* <!-- <button class="btn btn-primary">Apply</button> --> */}
              </div>
            </div>
          </div>
          <hr />
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h5>Location</h5>
              </div>
              <div class="col-12">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <img src={search} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={this.props.search}
                    onChange={this.props.handleFilterChange}
                    class="form-control inputsss"
                    placeholder="Ex:Bangalore,Hyderbad.."
                  />
                </div>
              </div>
            </div>
            {/* <div class="row">
              <div class="col-12">
                <h5>Created Date</h5>
              </div>
              <div class="col-12">
                <label for="" class="created_date">
                  Created Date
                </label>
                <input
                  type="text"
                  name="created_date"
                  class="form-control create_inpt"
                  placeholder="Select Date"
                />
              </div>
            </div> */}
            <div class="row mt-3">
              <div class="col-12">
                <h5>Builder</h5>
              </div>
              <div class="col-12">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <img src={search} />
                    </span>
                  </div>
                  <input
                    type="text"
                    name={this.props.builder}
                    value={this.props.filterBuilder}
                    onChange={this.props.handleBuilder}
                    class="form-control inputsss"
                    placeholder="Ex:Prestige,SKR.."
                  />
                </div>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-12">
                <h5>Type</h5>
              </div>
              <div class="col-12">
              <ul class="list_of_search">
                    {this.props.projectTypes.map(({ id, name }) => (
                        <li key={id}>
                            <label htmlFor="">
                                <input
                                    type="checkbox"
                                    name={id}
                                    onChange={this.props.handleProject}
                                />
                                { name }
                            </label>
                        </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* <div class="row mt-2">
              <div class="col-12">
                <h5>Carpet area in Sqft</h5>
              </div>
              <div class="col-12 slidecontainer">
                <span class="pull-left">0</span>
                <span class="float-right">100</span>
                <input
                  type="range"
                  min="20"
                  class="form-control"
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