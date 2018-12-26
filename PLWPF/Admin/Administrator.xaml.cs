﻿using System;
using System.Linq;
using System.Windows;
using BL;
using BE.MainObjects;
using PLWPF.Admin.ManageTest;
using PLWPF.Admin.ManageTester;
using PLWPF.Admin.ManageTrainee;

namespace PLWPF.Admin
{
    /// <summary>
    /// The administrator Window
    /// </summary>
    public partial class Administrator : Window
    {
        //a BL object
        private IBL bL = FactoryBl.GetObject;

        public Administrator()
        {
            InitializeComponent();

            RefreshData();

        }
        #region Trainee

        /// <summary>
        /// Update selected Trainee in a new window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UpdateTraineeClick(object sender, RoutedEventArgs e)
        {
            try
            {
            var win = new AddTrainee((TraineeGrid.SelectedItem as Trainee).Id);
            win.ShowDialog();
            RefreshData();
            }
            catch (Exception ex)
            {
                if (ex.Message != "Object reference not set to an instance of an object.")
                    MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Remove selected trainee 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RemoveTraineeClick(object sender, RoutedEventArgs e)
        {
            try
            {
                bL.RemoveTrainee((TraineeGrid.SelectedItem as Trainee));
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Add new trainee
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AddTraineeClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var win = new AddTrainee();
                win.ShowDialog();
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        #endregion

        #region Tester

        /// <summary>
        /// Update selected Trainee in a new window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UpdateTesterClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var win = new AddTester((TesterGrid.SelectedItem as Tester).Id);
                win.ShowDialog();
                RefreshData();
            }
            catch (Exception ex)
            {
                if(ex.Message!= "Object reference not set to an instance of an object.")
                MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Remove selected trainee 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RemoveTesterClick(object sender, RoutedEventArgs e)
        {
            try
            {
                bL.RemoveTester((TesterGrid.SelectedItem as Tester));
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Add new trainee
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AddTesterClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var win = new AddTester();
                win.ShowDialog();
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        #endregion

        #region Test

        /// <summary>
        /// Update selected Trainee in a new window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UpdateTestClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var win = new EditTest((TestGrid.SelectedItem as Test).Id);

                win.ShowDialog();
                RefreshData();
            }
            catch (Exception ex)
            {
                if (ex.Message != "Object reference not set to an instance of an object.")
                    MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Remove selected trainee 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RemoveTestClick(object sender, RoutedEventArgs e)
        {
            try
            {
                bL.RemoveTest((TestGrid.SelectedItem as Test));
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// Add new trainee
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AddTestClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var win = new EditTest();
                win.ShowDialog();
                RefreshData();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        #endregion
        /// <summary>
        /// refresh all Data Context
        /// </summary>
        private void RefreshData()
        {
            DataContext = null;
            DataContext = bL;
            NumberOfTraineesLabel.Content = bL.AllTrainees.Count().ToString();
            NumberOfTestersLabel.Content = bL.AllTesters.Count().ToString();
            NumberOfTestsLabel.Content = bL.AllTests.Count().ToString();
        }
    }
}