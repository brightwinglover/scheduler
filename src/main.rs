use chrono::prelude::*;
use chrono::Timelike;
use mongodb::{Collection, Database};
use std::env;
use twilio_async::{Twilio, TwilioRequest};

use futures::stream::TryStreamExt;
use mongodb::{bson::doc, options::FindOptions};
use mongodb::{options::ClientOptions, Client};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Job {
    Name: String,
    Method: String,
    Recipient: String,
    Message: String,
    Hour: u32,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    run_jobs().await?;
    Ok(())
}

async fn run_jobs() -> Result<(), Box<dyn std::error::Error>> {
    // Get the jobs collection - Typed for Job struct
    let collection = get_jobs().await?;

    // Filter the collection to the current hour's
    let now = Local::now();
    println!("Current hour: {:?}", now.hour());
    let filter = doc! { "Hour": now.hour() };

    // let find_options = FindOptions::builder().build();
    let mut cursor = collection.find(filter, None).await?;

    let mut operation_count = 0;
    while let Some(job) = cursor.try_next().await? {
        println!("Running {} via {}...", job.Name, job.Method);
        operation_count += 1;
        send_text(job).await?
        // Email hook goes here - check job.Method
    }
    println!("{} jobs ran.", operation_count);
    Ok(())
}

// Return the Clussy Cluster
async fn get_db() -> Result<Database, Box<dyn std::error::Error>> {
    // // Conection string
    // let client_uri = env::var("MONGODB_URI").expect("No MONGODB_URI set.");
    // let client = Client::with_uri_str(&client_uri).await?;

    // Connection string
    let client =
        Client::with_uri_str(env::var("MONGODB_URI").expect("No MONGODB_URI set.")).await?;

    let db = client.database("Clussy");
    Ok(db)
}

async fn get_jobs() -> Result<Collection<Job>, Box<dyn std::error::Error>> {
    let db = get_db().await?;
    let collection = db.collection::<Job>("Jobs");
    Ok(collection)
}

async fn send_text(job: Job) -> Result<(), Box<dyn std::error::Error>> {
    // API driver
    let twilio = Twilio::new(env::var("TWILIO_SID")?, env::var("TWILIO_TOKEN")?)?;
    // Twilio phone number
    let from = "+17622145785";

    let response = twilio
        .send_msg(&from, &job.Recipient, &job.Message)
        .run()
        .await?;
    println!("Response: {:?}", &response);
    Ok(())
}

async fn new_job(job: Job) -> Result<(), Box<dyn std::error::Error>> {
    let collection = get_jobs().await?;
    Ok(())
}
